#!/usr/bin/env bash
# remplace_TOKEN2022.sh

# Se placer à la racine de ton projet
# Exécuter : ./remplace_TOKEN2022.sh

find . -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  # Vérifier si le fichier contient TOKEN_2022_PROGRAM_ID
  if grep -q "TOKEN_2022_PROGRAM_ID" "$file"; then
    echo "🔄 Modifying $file"
    # Ajoute l’import si absent
    grep -q "from \"@solana-program/token-2022\"" "$file" || sed -i "1i import { TOKEN_2022_PROGRAM_ADDRESS } from \"@solana-program/token-2022\";" "$file"
    # Remplace toutes les occurrences de PROGRAM_ID
    sed -i "s/TOKEN_2022_PROGRAM_ID/TOKEN_2022_PROGRAM_ADDRESS/g" "$file"
  fi
done
