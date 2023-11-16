if [ -d "../.bun/bin" ]; then
  echo "Bun is installed!"
  clear
else 
  echo "Installing bun..."
  curl https://bun.sh/install | bash
  clear
fi