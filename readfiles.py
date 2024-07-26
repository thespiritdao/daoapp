import os

def get_directory_structure(directory):
    structure = {}
    for root, dirs, files in os.walk(directory):
        relative_path = os.path.relpath(root, directory)
        structure[relative_path] = []
        for dir_name in dirs:
            full_path = os.path.join(root, dir_name)
            structure[relative_path].append({"name": dir_name, "type": "dir"})
        for file_name in files:
            full_path = os.path.join(root, file_name)
            structure[relative_path].append({"name": file_name, "type": "file"})
    return structure

directory_structure = get_directory_structure("C:\\dao-app")
print(directory_structure)
