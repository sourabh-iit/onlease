import os
import time

local_onlease_root = '/home/onlease'
remote_onlease_root = '/root/prod/onlease'

def get_all_files_local(dir, prefix=''):
    dirname = dir.split('/')[-1]
    all_files = []
    with os.scandir(dir) as entries:
        for entry in entries:
            if entry.is_file():
                all_files.append(os.path.join(prefix, entry.name))
            else:
                files = get_all_files_local(os.path.join(dir, entry.name), os.path.join(prefix, entry.name))
                all_files.extend(files)
    return all_files

def get_all_files_remote():
    files = []
    result = os.system(f'ssh onlease ls -R {remote_onlease_root}/media')
    print(type(result))

def get_all_files_to_download():
    files_local = get_all_files_remote(f'{local_onlease_root}/media')
    files_remote = []
    result = os.system(f'ssh onlease ls -R {remote_onlease_root}/media')
    

def backup_db():
    os.system(f'ssh onlease "docker exec onlease_prod_db_1 pg_dump -U onlease onlease" | gzip > {local_onlease_root}/backup/data/db/db.gz')

get_all_files_remote()