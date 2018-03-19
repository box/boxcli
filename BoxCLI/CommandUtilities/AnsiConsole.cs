using System;

namespace BoxCLI.CommandUtilities
{
    internal class AnsiConsole
    {
        public static readonly AnsiTextWriter _out = new AnsiTextWriter(Console.Out);
        public static readonly AnsiTextWriter _err = new AnsiTextWriter(Console.Error);

        public static void WriteLine(string text, bool isErr = false)
        {
            if (isErr)
            {
                _err.WriteLine(text);
            }
            else
            {
                _out.WriteLine(text);
            }
        }
        public static void Write(string text, bool isErr = false)
        {
            if (isErr)
            {
                _err.Write(text);
            }
            else
            {
                _out.Write(text);
            }
        }
    }
}