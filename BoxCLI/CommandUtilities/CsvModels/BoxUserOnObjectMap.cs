using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxUserOnObjectMap : CsvClassMap<BoxUser>
    {
        public BoxUserOnObjectMap()
        {
			Map(m => m.Id).Name("BoxUserId");
			Map(m => m.Login).Name("BoxUserLogin");
			Map(m => m.Name).Name("BoxUserName");
        }
    }
}
