import json

def load_dataset(path):
    """
    Loads JSONL dataset for instruction fine-tuning
    """
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            data.append(json.loads(line))
    return data


def format_for_training(example):
    """
    Converts instruction format to plain text prompt
    """
    messages = example["messages"]
    formatted = ""

    for msg in messages:
        formatted += f"{msg['role'].upper()}: {msg['content']}\n"

    return formatted


if __name__ == "__main__":
    dataset = load_dataset("../dataset/mealplans.jsonl")
    print(f"Loaded {len(dataset)} samples")
    print(format_for_training(dataset[0]))
