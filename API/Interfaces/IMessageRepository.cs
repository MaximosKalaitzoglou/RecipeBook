using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.DTOs;
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

        Task<IEnumerable<MemberDto>> GetMessagingUsers(string currentUserName);

        Task<PaginationFilter<MessageDto>> GetMessagesForUser(MessageParams messageParams);

        Task<PaginationFilter<MessageDto>> GetMessageSocket(string currentUserName, string receiverUserName, UserParams userParams);

        void AddGroup(Group group);

        void RemoveConnection(Connection connection);

        Task<Connection> GetConnection(string connectionId);

        Task<Group> GetMessageGroup(string groupName);

        Task<List<string>> GetConnectionsForGroup(string groupName);

        Task<bool> SaveAllAsync();
    }

}