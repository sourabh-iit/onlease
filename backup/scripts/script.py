import os
import subprocess
from threading import Timer
from datetime import datetime

local_onlease_root = '/Users/sousingh/onlease'
remote_onlease_root = '/root/prod/onlease'
local_media_root = f'{local_onlease_root}/backup/data/media'
remote_media_root = f'{remote_onlease_root}/media'
local_db_path = f'{local_onlease_root}/backup/data/db'

def log(text):
    with open(f'{local_onlease_root}/backup/scripts/script.log', 'a+') as f:
        f.write(f"{datetime.now().strftime('%m/%d/%Y, %H:%M:%S')} {text} \n")

class ConnectionException(Exception):
    pass

def get_all_files_local(dir_path, prefix=''):
    if not os.path.exists(dir_path):
        return []
    dirname = dir_path.split('/')[-1]
    all_files = []
    with os.scandir(dir_path) as entries:
        for entry in entries:
            if entry.is_file():
                all_files.append(os.path.join(prefix, entry.name))
            else:
                files = get_all_files_local(os.path.join(dir_path, entry.name), os.path.join(prefix, entry.name))
                all_files.extend(files)
    return all_files

def get_all_files_remote():
    result = subprocess.run(['ssh', 'onlease', f'find {remote_media_root} -type f'], shell=False, check=True, capture_output=True)
    if result.stderr:
        raise ConnectionException(result.stderr)
    files = result.stdout.decode().split('\n')[:-1]
    return list(map(lambda x: x.replace(f'{remote_media_root}/', ''), files))

def get_all_files_to_download():
    files_remote = get_all_files_remote()
    files_local = get_all_files_local(local_media_root)
    files_to_download = []
    for f in files_remote:
        if f not in files_local:
            files_to_download.append(f)
    return files_to_download

def backup_media_files():
    files = get_all_files_to_download()
    for f in files:
        remote_location = f'{remote_media_root}/{f}'
        local_location = f'{local_media_root}/{f}'
        file_path = '/'.join(local_location.split('/')[:-1])
        if not os.path.exists(file_path):
            result = subprocess.run(['mkdir', '-p', file_path])
            if result.stderr:
                raise Exception(result.stderr)
        result = subprocess.run(['scp', f'root@103.86.176.106:{remote_location}', local_location], check=True, shell=False)
        if result.stderr:
            raise ConnectionException(result.stderr)

def backup_db():
    if not os.path.exists(local_db_path):
        result = subprocess.run(['mkdir', '-p', local_db_path])
        if result.stderr:
            raise Exception(result.stderr)
    result = subprocess.run([f'ssh onlease "docker exec onlease_prod_db_1 pg_dump -U onlease onlease" | gzip > {local_db_path}/db.gz'], check=True, shell=True)
    if result.stderr:
        raise ConnectionException(result.stderr)

def backup(try_num = 1):
    if try_num == 144:
        return
    try:
        backup_db()
        backup_media_files()
        log(f'# tries: {try_num}')
        log("exiting")
    except ConnectionException as e:
        log(e)
        log('will retry after 5 minutes')
        t = Timer(5*60, backup, [try_num+1])
        t.start()
    except Exception as e:
        log(e)
        log("exiting")


log("starting")
backup()