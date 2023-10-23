using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using recipes_app.DTOs.Response;
using recipes_app.Helpers;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Data.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        public readonly DataContext _context;
        public readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages.FindAsync(messageId);
        }

        public async Task<PaginationFilter<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                        .OrderByDescending(m => m.DateSend)
                        .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.ReceiverUsername == messageParams.Username),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username),
                _ => query.Where(u => u.ReceiverUsername == messageParams.Username && u.DateRead == null)
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PaginationFilter<MessageDto>.CreateAsync(messages, messageParams.Offset, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageSocket(string currentUserName, string receiverUserName)
        {
            var messages = await _context.Messages
            .Include(m => m.Sender)
            .ThenInclude(s => s.Photo)
            .Include(m => m.Receiver)
            .ThenInclude(r => r.Photo)
            .Where(
                m => m.ReceiverUsername == currentUserName &&
                m.SenderUsername == receiverUserName ||
                (m.ReceiverUsername == receiverUserName &&
                m.SenderUsername == currentUserName)

                )
            .OrderByDescending(m => m.DateSend)
            .ToListAsync();

            var unreadMessages = messages
            .Where(m => m.DateRead == null && m.ReceiverUsername == currentUserName)
            .ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }


            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}