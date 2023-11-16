clear
if [ -d "../.bun/bin" ]; then
  clear
else 
  curl https://bun.sh/install | bash
  clear
fi