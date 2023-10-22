using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace recipes_app.Helpers
{
    public class UserParams
    {

        private const int MaxPageSize = 5;

        public int Offset { get; set; } = 0;

        private int _pageSize = 5;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string Category { get; set; } = "all";


        public bool MostRecent { get; set; } = true;
    }
}