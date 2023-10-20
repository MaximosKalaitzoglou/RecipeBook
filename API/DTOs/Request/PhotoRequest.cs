using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.DTOs.Request
{
    public class PhotoRequest
    {
        public IFormFile File;

        public string Context { get; set; }
    }
}