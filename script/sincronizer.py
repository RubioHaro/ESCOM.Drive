import os
import configparser as cp
import shutil
import pysftp
import paramiko
from paramiko.py3compat import decodebytes

# credentials file name
CREDENTIALS_FILE = 'sftp_sync_credentials.properties'

# credentials section properties
CREDENTIALS_SECTION = 'dev.sftp'
SFTP_KEY = 'sftp_key'
SFTP_HOSTNAME = 'sftp_hostname'
SFTP_USERNAME = 'sftp_username'
SFTP_PASSWORD = 'sftp_password'


def sync_dir(remote_dir, local_dir, remove_outdated=True):
    """
    Sync to all the contents of remote_dir only.
    :param remote_dir:      Remote directory to sync from.
    :param local_dir:       Local directory to sync to.
    :param remove_outdated: If outdated items should be removed.
    :return                 The number of files synced.
    """

    files_synced = 0
    print('------------------------')
    print("sftp sync of '{}' starting...".format(remote_dir))
    sftp = _get_connection()
    if sftp is not None:
        try:
            files_synced = _sync_r(sftp, remote_dir, local_dir)
            print("synced {} file(s) from '{}'".format(files_synced, remote_dir))
            if remove_outdated:
                print("cleaning up outdated items of '{}' starting...".format(remote_dir))
                outdated_removed = _remove_outdated_r(sftp, remote_dir, local_dir)
                print("removed {} outdated item(s) of '{}'".format(outdated_removed, remote_dir))
            sftp.close()
        except:
            print("sync of '{}' could not complete successfully".format(remote_dir))
            files_synced = 0
    print('------------------------')
    return files_synced


def _get_connection():
    configuration = get_configuration(CREDENTIALS_FILE)
    if configuration is None:
        print('sftp configuration is missing!')
        return None
    else:
        # checking if the credentials section is present in the configuration
        if CREDENTIALS_SECTION not in configuration:
            print('sftp configuration is not correct!')
            return None
        credentials = dict(configuration.items(CREDENTIALS_SECTION))
        # checking if the required credentials items are present in the configuration
        if SFTP_HOSTNAME not in credentials or SFTP_USERNAME not in credentials or SFTP_PASSWORD not in credentials:
            print('sftp configuration is not correct!')
            return None
        # in case of any errors reporting the user about it
        try:
            # prepare the hostname key of the remote server if present in the configuration
            cnopts = pysftp.CnOpts()
            if SFTP_KEY in credentials:
                key = paramiko.RSAKey(data=decodebytes(credentials[SFTP_KEY].encode('utf-8')))
                cnopts.hostkeys.add(credentials[SFTP_HOSTNAME], 'ssh-rsa', key)
            return pysftp.Connection(credentials[SFTP_HOSTNAME], credentials[SFTP_USERNAME], cnopts=cnopts,
                                     password=credentials[SFTP_PASSWORD])
        except: # any errors during connection setup result in a non-usable connection
            print('sftp connection could not be established!')
            return None


def _sync_r(sftp, remote_dir, local_dir):
    """
    Recursively sync the sftp contents starting at remote dir to the local dir and return the number of files synced.
    :param sftp:        Connection to the sftp server.
    :param remote_dir:  Remote dir to start sync from.
    :param local_dir:   To sync to.
    :return             The number of files synced.
    """
    files_synced = 0
    for item in sftp.listdir(remote_dir):
        remote_dir_item = os.path.join(remote_dir, item)
        local_dir_item = os.path.join(local_dir, item)
        if sftp.isfile(remote_dir_item):
            if not os.path.exists(local_dir):
                os.makedirs(local_dir)
            if _should_sync_file(sftp, remote_dir_item, local_dir_item):
                print('sync {} => {}'.format(remote_dir_item, local_dir_item))
                sftp.get(remote_dir_item, local_dir_item, preserve_mtime=True)
                files_synced += 1
        else:
            files_synced += _sync_r(sftp, remote_dir_item, local_dir_item)
    return files_synced


def _should_sync_file(sftp, remote_file_path, local_file_path):
    """
    If the remote_file should be synced - if it was not downloaded or it is out of sync with the remote version.
    :param sftp:                Connection to the sftp server.
    :param remote_file_path:    Remote file path.
    :param local_file_path:     Local file path.
    """
    if not os.path.exists(local_file_path):
        return True
    else:
        remote_attr = sftp.lstat(remote_file_path)
        local_stat = os.stat(local_file_path)
        return remote_attr.st_size != local_stat.st_size or remote_attr.st_mtime != local_stat.st_mtime


def _remove_outdated_r(sftp, remote_dir, local_dir):
    items_removed = 0
    for item in os.listdir(local_dir):
        remote_dir_item = os.path.join(remote_dir, item)
        local_dir_item = os.path.join(local_dir, item)
        if not sftp.exists(remote_dir_item):
            print('removing {}'.format(local_dir_item))
            _remove(local_dir_item)
            items_removed += 1
        else:
            if os.path.isdir(local_dir_item):
                items_removed += _remove_outdated_r(sftp, remote_dir_item, local_dir_item)
    return items_removed


def _remove(path):
    """ param <path> could either be relative or absolute. """
    try:
        if os.path.isfile(path):
            os.remove(path)  # remove file
        else:
            shutil.rmtree(path)  # remove directory
    except Exception as e:
        print("could not remove {}, error {0}".format(path, str(e)))


def get_credentials():
    """
    Get the configuration parsed as an array.
    :param file:    The configuration file to parse.
    :return:        The configuration file parsed as an array or None if it is not present.
    """

    if os.path.exists(CREDENTIALS_FILE):
        credentials = cp.RawConfigParser()
        credentials.read(CREDENTIALS_FILE)
        return credentials
    else:
        print("[Error] Credentials file {} is not defined!".format(CREDENTIALS_FILE))
        return None