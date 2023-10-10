using Microsoft.AspNetCore.Mvc;

namespace recipes_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/users 
    public class BaseApiController : ControllerBase
    {

    }
}