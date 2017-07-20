using System;

namespace BoxCLI.CommandUtilities
{
    internal class AnsiConsole
    {
        public static readonly AnsiTextWriter _out = new AnsiTextWriter(Console.Out);

        public static void WriteLine(string text)
            => _out.WriteLine(text);
    }
}