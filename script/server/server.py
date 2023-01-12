import os
import socket
import threading



print("Starting Client....")
IP = socket.gethostbyname(socket.gethostname())
print("IP: ", IP)
PORT = 8080
## read a txt file to get the ip and port
if os.path.isfile("config.txt"):
    print("Reading config file")

    with open("config.txt", "r") as f:
        port = int(f.readline().strip())
        dir = f.readline().strip()
        
    print("PORT: ", port)
    print("DIR: ", dir)

    PORT = port
    DIR = dir

else:
    print("Config file not found")
    print("Using default values")
    DIR = "server_files"


ADDR = (IP, PORT)

SIZE = 1024
FORMAT = "utf-8"

DISCONNECTED_MSG = "!DISCONNECT"


def handle_client(conn, addr, n_client):
    print(f"[NEW CONNECTION] {addr} connected")

    n_dir = DIR
    if not os.path.isdir(n_dir):
        os.mkdir(n_dir)
    else :
        print("The folder already exists")

    connected = True

    while connected:
        # arreglo de archivos 
        files = os.listdir(n_dir)

        # Se recibe el nombre del archivo
        msgR = conn.recv(SIZE).decode(FORMAT)
        print(f"[{addr}] {msgR}")

        if(msgR in files):
            print("File already exists")
            msgS = "FAE"
            conn.send(msgS.encode(FORMAT))
        else: 
            # Se envia confirmacion de nombre de archivo
            msgS = f"Msg received: {msgR}"
            conn.send(msgS.encode(FORMAT))

            if msgR == DISCONNECTED_MSG:
                connected = False
            else:
                with open(os.path.join(n_dir, msgR), "wb") as f:
                    while True:
                        msgR = conn.recv(200)

                        if msgR != b"END":
                            print("[Client] Receiving data...")
                            f.write(msgR)

                            msgS = "Data received"
                            conn.send(msgS.encode(FORMAT))
                        else:
                            print("[Client] End Of File")

                            msgS = "End Of File"
                            conn.send(msgS.encode(FORMAT))
                            break

    conn.close()


def main():

    n_client = 0

    print("[Starting] Server is starting")
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)
    server.listen()
    print(f"[Listening] Server is listening on {IP}:{PORT}")

    while True:
        conn, addr = server.accept()

        n_client = n_client + 1

        thread = threading.Thread(target=handle_client, args=(conn, addr, n_client))
        thread.start()

        print(f"[ACTIVE CONECTIONS] {threading.active_count() - 1}")


if __name__ == "__main__":
    main()
