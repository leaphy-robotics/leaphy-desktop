import { BrowserWindow } from "electron";

export default function registerSerial(window: BrowserWindow) {
  window.webContents.session.on(
    "select-serial-port",
    (event, portList, webContents, callback) => {
      callback(portList[0].portId);
    },
  );
  window.webContents.session.on(
    "select-usb-device",
    (event, details, callback) => {
      callback(details.deviceList[0].deviceId);
    },
  );
}
