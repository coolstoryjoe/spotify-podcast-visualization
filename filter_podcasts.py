import json
import os
from glob import glob

def filter_podcasts():
    spotify_data_dir = "my_spotify_data (1)/Spotify Extended Streaming History"
    json_files = glob(os.path.join(spotify_data_dir, "*.json"))

    all_podcast_entries = []

    for file_path in json_files:
        print(f"Processing {file_path}...")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            podcast_entries = [
                entry for entry in data
                if entry.get('episode_name') is not None and entry.get('episode_show_name') is not None
            ]

            all_podcast_entries.extend(podcast_entries)
            print(f"Found {len(podcast_entries)} podcast entries in {os.path.basename(file_path)}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    print(f"\nTotal podcast entries found: {len(all_podcast_entries)}")

    # Sort by timestamp
    all_podcast_entries.sort(key=lambda x: x['ts'])

    # Save to new file
    output_file = "spotify_podcast_history.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_podcast_entries, f, indent=2, ensure_ascii=False)

    print(f"Podcast listening history saved to {output_file}")

    # Print some stats
    shows = {}
    total_ms = 0
    for entry in all_podcast_entries:
        show = entry.get('episode_show_name', 'Unknown')
        shows[show] = shows.get(show, 0) + 1
        total_ms += entry.get('ms_played', 0)

    print(f"\nTop 10 most listened podcasts:")
    for show, count in sorted(shows.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {show}: {count} episodes")

    hours = total_ms / (1000 * 60 * 60)
    print(f"\nTotal podcast listening time: {hours:.1f} hours")

if __name__ == "__main__":
    filter_podcasts()