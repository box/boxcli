using System;
using System.Text;
using System.Threading;
namespace BoxCLI.CommandUtilities
{
    public class ProgressBar
    {
        static private readonly object _sync = new object();

        public static void UpdateProgress(string item, int progress, int total)
        {
            int percentage = (int)100.0 * progress / total;
            lock (_sync)
            {
                Console.CursorLeft = 0;
                Console.Write(item + " [" + new string('=', percentage / 2) + "] " + percentage + "%");
            }
        }
    }
}