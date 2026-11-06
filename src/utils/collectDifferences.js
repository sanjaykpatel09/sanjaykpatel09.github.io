export default function collectDifferences(left, right, path = '$', differences = []) {
  const leftIsArray = Array.isArray(left);
  const rightIsArray = Array.isArray(right);

  if (leftIsArray !== rightIsArray) {
    differences.push({ path, left, right });
    return differences;
  }

  if (leftIsArray) {
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      const itemPath = `${path}[${index}]`;
      if (index >= left.length) {
        differences.push({ path: itemPath, right: right[index] });
      } else if (index >= right.length) {
        differences.push({ path: itemPath, left: left[index] });
      } else {
        collectDifferences(left[index], right[index], itemPath, differences);
      }
    }
    return differences;
  }

  const leftIsObject = left !== null && typeof left === 'object';
  const rightIsObject = right !== null && typeof right === 'object';
  if (leftIsObject !== rightIsObject || !leftIsObject) {
    if (!Object.is(left, right)) differences.push({ path, left, right });
    return differences;
  }

  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
  for (const key of keys) {
    const itemPath = `${path}[${JSON.stringify(key)}]`;
    const hasLeft = Object.hasOwn(left, key);
    const hasRight = Object.hasOwn(right, key);
    if (!hasLeft) {
      differences.push({ path: itemPath, right: right[key] });
    } else if (!hasRight) {
      differences.push({ path: itemPath, left: left[key] });
    } else {
      collectDifferences(left[key], right[key], itemPath, differences);
    }
  }

  return differences;
}
