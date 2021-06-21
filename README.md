move the `.service` file to `/lib/systemd/system/`

```
sudo systemctl daemon-reload
sudo systemctl enable <.service file name>
sudo restart
```