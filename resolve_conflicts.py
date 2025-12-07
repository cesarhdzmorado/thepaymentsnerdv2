#!/usr/bin/env python3
"""Resolve git conflicts in package-lock.json by keeping HEAD version"""

def resolve_conflicts(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Split by conflict markers
    parts = content.split('<<<<<<< HEAD\n')
    
    if len(parts) == 1:
        print(f"No conflicts found in {filepath}")
        return
    
    result = parts[0]  # Start with everything before first conflict
    
    for part in parts[1:]:
        # Split by separator
        if '=======\n' not in part:
            result += part
            continue
            
        ours, rest = part.split('=======\n', 1)
        
        # Find the end marker
        if '>>>>>>> d72d8f6' not in rest:
            result += '<<<<<<< HEAD\n' + part
            continue
        
        # Extract the part after the merge marker
        theirs_end = rest.find('>>>>>>> d72d8f6')
        remaining = rest[theirs_end + len('>>>>>>> d72d8f6 (Updates of the NextJs)\n'):]
        
        # Keep HEAD version (ours)
        result += ours + remaining
    
    with open(filepath, 'w') as f:
        f.write(result)
    
    print(f"✓ Resolved conflicts in {filepath}")

if __name__ == '__main__':
    resolve_conflicts('/workspaces/thepaymentsnerdv2/web/package-lock.json')
