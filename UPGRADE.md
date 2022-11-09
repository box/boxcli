# Upgrade

## Version 3.5.0 to 3.6.0

Make sure you are on the latest version 3.5.0.
In version 3.6.0, we introduced a change in response in theese following command:

- `box files:share`
- `box files:shared-links:create`
- `box files:shared-links:update`
- `box folders:share`
- `box folders:shared-links:create`
- `box folders:shared-links:update`
- `box shared-links:create`

Before:
```json
{
    "url": "https://blosserdemoaccount.box.com/s/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p",
    "download_url": "https://blosserdemoaccount.box.com/shared/static/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p.png",
    "vanity_url": null,
    "effective_access": "open",
    "is_password_enabled": true,
    "unshared_at": null,
    "download_count": 0,
    "preview_count": 0,
    "access": "test",
    "permissions": {
        "can_download": true,
        "can_preview": true,
        "can_edit": true
    }
}
```

After:
```json 
{
    "type": "file",
    "id": "1234567890",
    "shared_link": {
        "url": "https://blosserdemoaccount.box.com/s/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p",
        "download_url": "https://blosserdemoaccount.box.com/shared/static/7mcmdlavtye5o5i0ue8xmtwh2sx5bv8p.png",
        "vanity_url": null,
        "effective_access": "open",
        "is_password_enabled": true,
        "unshared_at": null,
        "download_count": 0,
        "preview_count": 0,
        "access": "test",
        "permissions": {
            "can_download": true,
            "can_preview": true,
            "can_edit": true
        }
    }
}
```

Please check if you are using any of the commands above, then update the usage to avoid any breaks.