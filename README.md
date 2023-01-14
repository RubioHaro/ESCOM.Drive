# ESCOM.Drive
Proyecto de Redes, con el objetivo de crear un sistema de almacenamiento en la nube, con la capacidad de almacenar archivos de cualquier tipo, con la capacidad de realizar respaldos de los mismo en diferentes servidores.

## Arquitectura

### Cliente
Una aplicación web, basada en React, que permite al usuario subir archivos y descargarlos.

Se corre con el comando `npm start` en la carpeta `client`.

### Servidor
Un servidor web, basado en NodeJS, que hace de backend para el cliente, recibiendo peticiones de carga y descarga de archivos.

Se corre con el comando `npm start` en la carpeta `server`.

### Sincronizador (Script)
Un script en Python, que se encarga de sincronizar los archivos entre los servidores.

El cliente se corre con el comando `python3 client.py` en la carpeta `script/client`.
El servidor se corre con el comando `python3 server.py` en la carpeta `script/server`.

Revisar los archivos `config.json` en las carpetas `script/client` y `script/server` para configurar los puertos y las rutas de los archivos.