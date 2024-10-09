set -e
rm -f *.json
FILES=(chat-completions-1 completions-1 embeddings-2 models-2 post_images-generations get_files get_files-id delete_files-id get_files-id-content post_fine-tunes get_fine-tunes get_fine-tunes-id get_fine-tunes-id-events get_finetune-download post_fine-tunes-id-cancel rerank-1)
for F in ${FILES[@]}; do
	echo "Downloading $F..."
	curl "https://docs.together.ai/reference/$F?json=on" -H 'x-requested-with: XMLHttpRequest' > $F.json
	echo "Downloaded $F."
done
