import socket
import os
import time

SIZE = 1024
FORMAT = "utf-8"

DISCONNECTED_MSG = "!DISCONNECT"


class Client:
    def __init__(self, IP, PORT, DIR):
        self.ip = IP
        self.port = PORT
        self.dir = DIR
        self.ADDR = (IP, PORT)
    def __str__(self):
        return f"IP: {self.ip}, PORT: {self.port}, DIR: {self.dir}"


def start_client(config_file):

    print("Starting Client....")
    ## read a txt file to get the ip and port
    if os.path.isfile(config_file):
        print("Reading config file")

        with open(config_file, "r") as f:
            ip = f.readline().strip()
            port = int(f.readline().strip())
            dir = f.readline().strip()

    else:
        print("Config file not found")
        exit()

    if not os.path.isdir(dir):
        print("The folder does not exist")
        exit()

    return Client(ip, port, dir)

def ana_dir(dir):
    cont = os.listdir(dir)

    files = []

    for file in cont:
        if os.path.isfile(os.path.join(dir, file)):
            files.append(file)

    files.append(DISCONNECTED_MSG)

    return files


def main():
    manager_config_folder = "configs"
    # verify that folder exists 
    if not os.path.isdir(manager_config_folder):
        print("The folder does not exist")
        exit()
    else:
        print("Searching config files...")
        config_files = os.listdir(manager_config_folder)
        if config_files == []:
            print("No config files found")
            exit()
            
        print("Config files found: ")
        for file in config_files:
            print("\t|-", file)

        print("\nCreating clients...")
        for file in config_files:
            print("Creating for: ", file)
            ## create a client per file
            client_model =  start_client(manager_config_folder + "/" + "config.txt")
            
            files = ana_dir(client_model.dir)
            first = True
            while True:
                newFiles = ana_dir(client_model.dir);
                if first == True:
                    change_flag = True
                    first = False
                else:
                    print("Waiting for changes...")
                    change_flag = newFiles != files

                if change_flag == True:
                    files = newFiles
                    print("The files in the folder are: ")
                    for file in files:
                        print("\t|-", file)

                    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

                    client.connect(client_model.ADDR)

                    print(f"[CONNECTED] Client connected to server at {client_model.ip}:{client_model.port}")

                    connected = True

                    while connected:
                        for file in files:

                            # Se envia el nombre del archivo
                            msgS = file
                            client.send(msgS.encode(FORMAT))

                            # Se recibe confirmacion
                            msgR = client.recv(SIZE).decode(FORMAT)
                            if(msgR == "FAE"):
                                print("File already exists")
                                continue
                            # print(f"[Server] {msgR}")

                            if msgS == DISCONNECTED_MSG:
                                connected = False
                            else:
                                with open(os.path.join(client_model.dir, msgS), "rb") as f:
                                    while True:
                                        msgS = f.read(200)

                                        if len(msgS) != 0:
                                            client.send(msgS)

                                            msgR = client.recv(SIZE).decode(FORMAT)
                                            print(f"[Server] {msgR}")
                                        else:
                                            client.send(b"END")

                                            msgR = client.recv(SIZE).decode(FORMAT)
                                            print(f"[Server] {msgR}")

                                            break
                    change_flag = False
                else: 
                ## wait 30 seconds
                    time.sleep(5)
                    continue


if __name__ == "__main__":
   main()
