using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using recipes_app.Models;

namespace recipes_app.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}