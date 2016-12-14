#!/bin/bash

# Add pre-push hook

echo "#!/bin/bash

git log --pretty=format:\"%s\" | head -n 1 | grep 'Bumped to version .*'

if [ \$? == 0 ]
then
        exit 0
else
        echo -e \"\e[00;31mPlease run 'npm run bump-up' before pushing your changes\e[00m\"
        exit 1
fi
" > .git/hooks/pre-push

chmod +x .git/hooks/pre-push
