using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Models;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.Logging;

namespace BoxCLI.BoxPlatform.Utilities
{
    public class BoxCollectionsIterators : IBoxCollectionsIterators
    {
        public string PageInConsole<T>(Action<T> print, BoxCollection<T> collection) where T : class, new()
        {
            print(collection.Entries[0]);
            collection.Entries.RemoveAt(0);
            Reporter.WriteInformation("Show next? Enter q to quit. ");
            return System.Console.ReadLine().Trim().ToLower();
        }
        public string PageInConsole<T>(Action<T> print, BoxCollectionMarkerBased<T> collection) where T : class, new()
        {
            print(collection.Entries[0]);
            collection.Entries.RemoveAt(0);
            Reporter.WriteInformation("Show next? Enter q to quit. ");
            return System.Console.ReadLine().Trim().ToLower();
        }
        public string PageInConsole(Action<BoxEnterpriseEvent> print, BoxEventCollection<BoxEnterpriseEvent> collection)
        {
            print(collection.Entries[0]);
            collection.Entries.RemoveAt(0);
            Reporter.WriteInformation("Show next? Enter q to quit. ");
            return System.Console.ReadLine().Trim().ToLower();
        }

        public async Task ListOffsetCollectionToConsole<T>(Func<uint, Task<BoxCollection<T>>> callBox, Action<T> print, int limit = -1) where T : BoxEntity, new()
        {
            var showNext = "";
            uint offset = 0;
            var collection = await callBox(offset);
            var all = collection.TotalCount;
            var total = collection.TotalCount;
            while (all > 0 && showNext != "q" && offset < total)
            {
                if (collection.Entries.Count > 0)
                {
                    if (limit == 0)
                    {
                        break;
                    }
                    limit--;
                    all--;
                    showNext = PageInConsole(print, collection);
                }
                else
                {
                    Reporter.WriteInformation("Please wait...");
                    offset += (uint)collection.Limit;
                    collection = await callBox(offset);
                }
            }
        }

        public async Task ListMarkerCollectionToConsole<T>(Func<string, Task<BoxCollectionMarkerBased<T>>> callBox, Action<T> print) where T : BoxEntity, new()
        {
            var keepGoing = false;
            var showNext = "";
            do
            {
                string marker = "";
                var collection = await callBox(marker);
                if (collection.Entries.Count > 0)
                {
                    while (collection.Entries.Count > 0 && showNext != "q")
                    {
                        showNext = PageInConsole(print, collection);
                    }
                }
                else
                {
                    marker = collection.NextMarker;
                    collection = await callBox(marker);
                }
                keepGoing = !string.IsNullOrEmpty(collection.NextMarker);
            }
            while (keepGoing && showNext != "q");
        }
        public async Task ListEventCollectionToConsole(Func<string, Task<BoxEventCollection<BoxEnterpriseEvent>>> callBox, Action<BoxEnterpriseEvent> print)
        {
            var keepGoing = false;
            var showNext = "";
            do
            {
                string streamPosition = "";
                var collection = await callBox(streamPosition);
                if (collection.Entries.Count > 0)
                {
                    while (collection.Entries.Count > 0 && showNext != "q")
                    {
                        showNext = PageInConsole(print, collection);
                    }
                }
                else
                {
                    streamPosition = collection.NextStreamPosition;
                    collection = await callBox(streamPosition);
                }
                keepGoing = !string.IsNullOrEmpty(collection.NextStreamPosition);
            }
            while (keepGoing && showNext != "q");
        }

        public async Task<BoxEventCollection<BoxEnterpriseEvent>> ReturnAllEvents(Func<string, Task<BoxEventCollection<BoxEnterpriseEvent>>> callBox)
        {
            var keepGoing = true;
            var fullCollection = new BoxEventCollection<BoxEnterpriseEvent>();
            fullCollection.Entries = new List<BoxEnterpriseEvent>();
            string streamPosition = "";
            do
            {
                var collection = await callBox(streamPosition);
                if (collection.Entries.Count > 0)
                {
                    fullCollection.Entries.AddRange(collection.Entries);
                }
                if (collection != null && !string.IsNullOrEmpty(collection.NextStreamPosition))
                {
                    streamPosition = collection.NextStreamPosition;
                }
                keepGoing = collection.Entries.Count != 0;
            }
            while (keepGoing);
            return fullCollection;
        }
    }
}