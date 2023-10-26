
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Extensions;
using recipes_app.Helpers;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMemberRepository _memberRepository;

        private readonly IMapper _mapper;


        public ChatHub(IMessageRepository messageRepository, IMemberRepository memberRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
            _mapper = mapper;
        }

        public async override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await _messageRepository.GetMessageSocket(Context.User.GetUsername(), otherUser, new UserParams());

            await Clients.Group(groupName).SendAsync("ReceiveMessageSocket", messages);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            var username = Context.User.GetUsername();
            if (username == messageRequest.ReceiverUsername.ToLower())
            {
                throw new HubException("You cannot send messages to yourself");
            }

            var sender = await _memberRepository.GetUserByUserNameAsync(username);

            var receiver = await _memberRepository.GetUserByUserNameAsync(messageRequest.ReceiverUsername);

            if (receiver == null) throw new HubException("The user you are trying to message is not found ");

            var message = new Message
            {
                Sender = sender,
                Receiver = receiver,
                SenderUsername = sender.UserName,
                ReceiverUsername = receiver.UserName,
                Content = messageRequest.Content
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync())
            {
                var group = GetGroupName(sender.UserName, receiver.UserName);
                await Clients.Group(group).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }

            throw new HubException("Something went wrong sending the message");
        }

        public async Task LoadMoreMessages(string otherUser, int offset, int pageSize)
        {
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            var userParams = new UserParams
            {
                Offset = offset,
                PageSize = pageSize
            };

            var messages = await _messageRepository.GetMessageSocket(Context.User.GetUsername(), otherUser, userParams);

            await Clients.Group(groupName).SendAsync("ReceiveMessageSocket", messages);
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;

            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}