@echo Beginning custom build

@echo Cleaning project of generated css 
del public\stylesheets\app\*.css /S

@echo About to build less
call grunt

@echo Finished custom build