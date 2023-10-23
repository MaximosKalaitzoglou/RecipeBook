using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using recipes_app.DTOs.Request;
using recipes_app.DTOs.Response;
using recipes_app.Extensions;
using recipes_app.Interfaces;
using recipes_app.Models;

namespace recipes_app.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IMapper _mapper;

        public MessagesController(IMemberRepository memberRepository,
        IMessageRepository messageRepository, IMapper mapper)
        {
            _messageRepository = messageRepository;
            _memberRepository = memberRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(MessageRequest messageRequest)
        {
            var username = User.GetUsername();
            if (username == messageRequest.ReceiverUsername.ToLower()) return BadRequest("You cannot send messages to yourself");

            var sender = await _memberRepository.GetUserByUserNameAsync(username);

            var receiver = await _memberRepository.GetUserByUserNameAsync(messageRequest.ReceiverUsername);

            if (receiver == null) return NotFound("The user you are trying to message is not found ");

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
                return CreatedAtAction(nameof(CreateMessage), new
                {
                    messageId = message.MessageId
                }, _mapper.Map<MessageDto>(message));
            }

            return BadRequest("Something went wrong saving the message");
        }
    }
}