/**
 * @param center: The upper pentas' centers' position
 * @param radius: The upper large* penta's radius (* or: outer, blue)
 * @param angle:  All pentas' default angle
 * @param style: style configuration
 */
function GoldenBody(center, radius, angle, ps) {

  this.center = center;
  this.radius = radius;
  this.angle = angle || 0;

  this.root = new Penta(this.center, this.radius, this.angle);

  createPentaTree(this);
}

GoldenBody.prototype.getPentaSubtree = function(propertyPathArray) {
  if (!propertyPathArray) return;
  let subtree = this.pentaTree;
  propertyPathArray.forEach((prop) => subtree = subtree? subtree[prop] : undefined);
  return subtree;
}

GoldenBody.prototype.getPentaSubtreeWithWildcards = function(propertyPathArray) {
  if (!propertyPathArray) return;
  let subtree = this.pentaTree;
  return subtree;
}
/**
 * creates a list of matching paths for the specified wildcard path.
 *
 * @param propertyPathArray: a property path containing wildcards
 */
GoldenBody.prototype.expandWildcards = function(tree, propertyPathArray) {
  let matchingPaths = [];
  matchPathRecursively(this.pentaTree, "", propertyPathArray);

  /**
   * With a wildcard as the last property in the path the complete subtree matches.
   * With a wildcard in the middle of the path we need to look for the property after the wildcard in the path.
   */
  function matchPathRecursively(subtree, currentTraversedPath, remainingPathExpression, wildcard) {
    let wildcardRemaining = remainingPathExpression[0] === "*";
    let lastPathProperty = remainingPathExpression.length === 1;
    let pathTerminated = remainingPathExpression.length === 0;
    let childKeys = Object.keys(subtree);
    let hasChildKeys = childKeys.length > 0;


    if (pathTerminated) {
      matchingPaths.push(currentTraversedPath);
      return;
    }
    if (wildcardRemaining) {
      if (lastPathProperty) {
        subtreeToPathArray(subtree, currentTraversedPath) // the whole subtree is a match
        return;
      } else {

        wildcard = true;

        // check for the subsequent property anywhere in the path
        // then continue with the remainingPathExpression
        Object.keys(subtree).forEach((key) => {
          // The current path is still valid if it either matches the next path property
          if (key.toLowerCase() === remainingPathExpression[0].toLowerCase()) {
            matchPathRecursively(subtree[key], currentTraversedPath.concat(key), remainingPathExpression.slice(1), wildcard);
          }
        });
      }
    }
  }

  function subtreeToPathArray(subtree) {
    return Object.keys(subtree).reduce((pathArray, key) => {
      // TODO
      return pathArray;
    });
  }
}
