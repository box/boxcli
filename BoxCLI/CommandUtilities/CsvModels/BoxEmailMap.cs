using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
	public class BoxEmailMap : CsvClassMap<BoxEmail>
	{
		public BoxEmailMap()
		{
			Map(m => m.Acesss).Name("FolderUploadEmailAccess");
		}
	}
}
