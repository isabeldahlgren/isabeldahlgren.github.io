import re
import sys

def replace_patterns_in_file(input_file, output_file, patterns_and_replacements):
    try:
        with open(input_file, 'r') as file:
            content = file.read()

        # Use regular expression to replace the specified patterns
        modified_content = content
        for pattern, replacement in patterns_and_replacements:
            modified_content = re.sub(pattern, replacement, modified_content)

        with open(output_file, 'w') as file:
            file.write(modified_content)

        print(f"Replacement successful. Result written to {output_file}.")

    except FileNotFoundError:
        print(f"File not found: {input_file}")

if __name__ == "__main__":

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]
    patterns_and_replacements = [(r' <!-- (\d)* -->', ''), (r'<g>', ''), (r'</g>', '')]

    replace_patterns_in_file(input_file_path, output_file_path, patterns_and_replacements)
