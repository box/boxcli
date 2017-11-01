using System;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Models;

namespace BoxCLI.BoxPlatform.Utilities
{
    public interface IBoxCollectionsIterators
    {
        Task ListOffsetCollectionToConsole<T>(Func<uint, Task<BoxCollection<T>>> callBox, Action<T> print, int limit = -1) where T : BoxEntity, new();
        Task ListMarkerCollectionToConsole<T>(Func<string, Task<BoxCollectionMarkerBased<T>>> callBox, Action<T> print) where T : BoxEntity, new();
        Task ListEventCollectionToConsole(Func<string, Task<BoxEventCollection<BoxEnterpriseEvent>>> callBox, Action<BoxEnterpriseEvent> print);
        Task<BoxEventCollection<BoxEnterpriseEvent>> ReturnAllEvents(Func<string, Task<BoxEventCollection<BoxEnterpriseEvent>>> callBox);
        string PageInConsole<T>(Action<T> print, BoxCollection<T> collection) where T : class, new();
    }
}