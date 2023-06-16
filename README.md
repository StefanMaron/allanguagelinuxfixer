# allanguagelinuxfixer README

This extension will patch your AL Language files so you can use it on Ubuntu.
All you need to do is to run the command `Patch current AL Language Extension`.

Since GitHub codespaces are running Ubuntu, it will make the AL Language extension work there as well.

Precondition is Dotnet Code 6.0.x (this is not installed on codespaces by default AFAIK)

To install, run this in a terminal

```
sudo apt update 
sudo apt install dotnet-sdk-6.0 -y
```

You can then run `whereis dotnet` to find all possible locations of a dotnet executable
You can check the version for them by specifying the whole path and pass in the version argument

For example `/bin/dotnet --version`. This should print the correct version.

The default dotnet path used is `/bin/dotnet`, If that is not correct on your machine, you can use the setting 
`"allanguagelinuxpatcher.dotnet-path": "/bin/dotnet"` to adjust.

Since the patching of the AL language is not versible, you might need to reinstall the extension of you change the path after you already patched.

Also:
Microsoft might change the extensions code, which would break this extension. 
I will have a look it, but please create an issue on github if the patch does not work anymore.