using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.DTOs.Response;
using recipes_app.Helpers;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);

        void DeleteMessage(Message message);

        Task<Message> GetMessage(int messageId);

        Task<PaginationFilter<MessageDto>> GetMessagesForUser();

        Task<IEnumerable<MessageDto>> GetMessageSocket(int currentUserId, int receiverId);

        Task<bool> SaveAllAsync();
    }

}