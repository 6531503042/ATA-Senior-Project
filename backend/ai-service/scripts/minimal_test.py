import sys
print("Python path:", sys.path)
print("\nTrying to import pymongo...")
try:
    import pymongo
    print("pymongo version:", pymongo.__version__)
    print("Successfully imported pymongo!")
except ImportError as e:
    print("Failed to import pymongo:", str(e))
    print("\nChecking installed packages:")
    import pkg_resources
    installed_packages = [d for d in pkg_resources.working_set]
    for package in installed_packages:
        print(package) 