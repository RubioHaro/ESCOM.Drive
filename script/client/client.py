import socket
import os
import time
import threading

SIZE = 1024
FORMAT = "utf-8"

DISCONNECTED_MSG = "!DISCONNECT"


class Client:
    def __init__(self, IP, PORT, DIR, id):
        self.name = "Client[" + id+"]"
        self.ip = IP
        self.port = PORT
        self.dir = DIR
        self.ADDR = (IP, PORT)

    def __str__(self):
        return f"IP: {self.ip}, PORT: {self.port}, DIR: {self.dir}"


def start_client(config_file , id):
    print("Starting Client....")
    # read a txt file to get the ip and port
    if os.path.isfile(config_file):
        print("Reading config file at: " + config_file)

        with open(config_file, "r") as f:
            ip = f.readline().strip()
            port = int(f.readline().strip())

        print("Config file readed")

    else:
        print("Config file not found")
        exit()

    return Client(ip, port, "", id)


def ana_dir(dir):
    cont = os.listdir(dir)

    files = []

    for file in cont:
        if os.path.isfile(os.path.join(dir, file)):
            files.append(file)

    files.append(DISCONNECTED_MSG)

    return files


def threading_client(client_model, files):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(client_model.ADDR)
    print(
        f" {client_model.name } [CONNECTED] Client connected to server at {client_model.ip}:{client_model.port}")
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


def main():
    print("Starting Client Manager....")
    print("Do you want to use the dev files folder? (y/n)")
    answer = input()
    if answer == "y" or answer == "Y" or answer == "":
        general_directory = "/home/roy/Desktop/dev/ESCOM.Drive/script/client/test"
        if not os.path.isdir(general_directory):
            print("The folder does not exist, please enter the path of the folder: ")
            general_directory = input()
    else:
        print("Enter the path of the folder: ")
        general_directory = input()

    print("system: using " + general_directory)
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
        contador = 0
        clientList = []
        for file_config in config_files:
            print("Creating for: ", file_config)
            # create a client per file
            client_model = start_client("./" + 
                manager_config_folder + "/" + file_config, str(contador+1))
            # create a thread for each client
            client_model.dir = general_directory
            clientList.append(client_model)
            contador += 1


        files = ana_dir(general_directory)
        first = True
        system_name = "Syncronizer_client:"
        while True:
            newFiles = ana_dir(general_directory)
            if first == True:
                change_flag = True
                first = False
            else:
                print(system_name + 
                    "Waiting for changes at the folder: " + general_directory + "....")
                change_flag = newFiles != files

            if change_flag == True:
                print(system_name  + ": " +
                      "Changes detected at the folder: " + general_directory + "....")
                files = newFiles
                print("The files in the folder are: ")
                for file in files:
                    print("\t|-", file)

                print("Starting threads...")
                for client_instance in clientList:
                    threads = threading.Thread(target=threading_client, args=(client_instance, files))
                    threads.start()

                print("Waiting for threads to finish...")
                threads.join()
                print("Threads finished")


                    
               
                change_flag = False
            else:
                # wait 30 seconds
                time.sleep(5)
                continue


if __name__ == "__main__":
    main()
