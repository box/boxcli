using System;

namespace BoxCLI.CommandUtilities.Exceptions
{
    public class NoEnvironmentsFoundException : Exception
    {
        public NoEnvironmentsFoundException(string message) : base(message)
        {
        }
    }
}