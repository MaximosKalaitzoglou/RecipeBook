using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using recipes_app.DTOs;
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

        public async Task<PaginationFilter<MemberDto>> GetMessagingUsers(string currentUserName, UserParams userParams)
        {
            var senders = _context.Messages
                .Where(m => m.ReceiverUsername == currentUserName)
                .Include(u => u.Sender.Photo)
                .Select(m => m.Sender)
                .AsQueryable();

            var receivers = _context.Messages
                .Where(m => m.SenderUsername == currentUserName)
                .Include(u => u.Receiver.Photo)
                .Select(m => m.Receiver)
                .AsQueryable();

            var query = senders.Union(receivers).Distinct();

            var messages = query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider);

            return await PaginationFilter<MemberDto>.CreateAsync(messages, userParams.Offset, userParams.PageSize);

        }



        public async Task<PaginationFilter<MessageDto>> GetMessageSocket(string currentUserName, string receiverUserName, UserParams userParams)
        {
            var query = _context.Messages
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
            .AsQueryable();

            var unreadMessages = query
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

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PaginationFilter<MessageDto>.CreateAsync(messages, userParams.Offset, userParams.PageSize);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}