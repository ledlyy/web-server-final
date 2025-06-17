import json

def analyze_longest_sentence_and_word(filename='q.json'):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: '{filename}' not found.")
        return
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return

    total = len(data)
    sentence_matches = 0
    word_matches = 0

    print("Analyzing...\n")

    for idx, item in enumerate(data, start=1):
        options = item.get('options', {})
        correct = item.get('correctAnswer')
        if not options or correct not in options:
            print(f"Question {idx}: Skipped (invalid or missing data)")
            continue

        # --- Longest sentence (by character length) ---
        longest_sentence_key = max(options, key=lambda k: len(options[k]))

        # --- Longest word (by word length) ---
        word_lengths = {
            k: max(options[k].split(), key=len, default='') for k in options
        }
        longest_word_key = max(word_lengths, key=lambda k: len(word_lengths[k]))

        sentence_correct = longest_sentence_key == correct
        word_correct = longest_word_key == correct

        if sentence_correct:
            sentence_matches += 1
        if word_correct:
            word_matches += 1

        print(f"Q{idx}:")
        print(f"  Longest sentence → {longest_sentence_key} {'✅' if sentence_correct else f'❌ (correct: {correct})'}")
        print(f"  Longest word     → {longest_word_key} {'✅' if word_correct else f'❌ (correct: {correct})'}")

    # --- Summary ---
    print("\nSummary:")
    print(f"  Total questions: {total}")
    print(f"  Longest sentence matched: {sentence_matches} → {sentence_matches/total:.2%}")
    print(f"  Longest word matched   : {word_matches} → {word_matches/total:.2%}")

if __name__ == "__main__":
    analyze_longest_sentence_and_word('q.json')
