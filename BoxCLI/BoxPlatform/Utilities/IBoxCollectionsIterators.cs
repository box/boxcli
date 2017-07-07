using System;
using System.Threading.Tasks;
using Box.V2.Models;

namespace BoxCLI.BoxPlatform.Utilities
{
    public interface IBoxCollectionsIterators
    {
        Task ListOffsetCollectionToConsole<T>(Func<uint, Task<BoxCollection<T>>> callBox, Action<T> print) where T : BoxEntity, new();

        string PageInConsole<T>(Action<T> print, BoxCollection<T> collection) where T : class, new();
    }
}