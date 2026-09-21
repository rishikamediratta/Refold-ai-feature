/**
 * Schema Diff & Impact Mapping Analysis Utility
 * Compares v1 (old) and v2 (new) JSON schemas, detects structural drift,
 * and cross-references against integration mapping configuration.
 */

export function analyzeSchemaChanges(oldSchema, newSchema, mappingConfig) {
  const oldProps = oldSchema?.properties || {};
  const newProps = newSchema?.properties || {};
  const mappings = mappingConfig?.mappings || [];

  const detectedChanges = [];

  // 1. Check for removed or renamed fields
  Object.keys(oldProps).forEach((fieldName) => {
    const oldProp = oldProps[fieldName];
    const newProp = newProps[fieldName];

    if (!newProp) {
      // Check if it was renamed to another field in newProps
      const renamedToEntry = Object.entries(newProps).find(([newKey, val]) => {
        const desc = val.description || '';
        return desc.toLowerCase().includes(`renamed from ${fieldName}`) ||
               desc.toLowerCase().includes(`renamed from '${fieldName}'`);
      });

      if (renamedToEntry) {
        detectedChanges.push({
          field: fieldName,
          type: 'RENAMED',
          oldField: fieldName,
          newField: renamedToEntry[0],
          oldType: oldProp.type,
          newType: renamedToEntry[1].type,
          description: `Field '${fieldName}' was renamed to '${renamedToEntry[0]}'`
        });
      } else {
        detectedChanges.push({
          field: fieldName,
          type: 'REMOVED',
          oldField: fieldName,
          oldType: oldProp.type,
          description: `Field '${fieldName}' was removed from the target schema`
        });
      }
    } else {
      // Field exists in both. Check for data type mismatch
      if (oldProp.type !== newProp.type) {
        detectedChanges.push({
          field: fieldName,
          type: 'TYPE_MISMATCH',
          oldField: fieldName,
          oldType: oldProp.type,
          newType: newProp.type,
          description: `Data type changed from '${oldProp.type}' to '${newProp.type}'`
        });
      }
    }
  });

  // 2. Cross-reference detected changes against mapping configuration
  const affectedMappings = [];
  const healthyMappings = [];

  mappings.forEach((mapping) => {
    // Extract base field name from source string e.g. "crm.contact_email" -> "contact_email"
    const sourceFieldName = mapping.source_field.replace(/^crm\./, '').replace(/^api\./, '');
    
    // Find matching change
    const matchedChange = detectedChanges.find(c => c.field === sourceFieldName || c.oldField === sourceFieldName);

    if (matchedChange) {
      affectedMappings.push({
        ...mapping,
        detectedChange: matchedChange
      });
    } else {
      healthyMappings.push(mapping);
    }
  });

  return {
    detectedChanges,
    affectedMappings,
    healthyMappings,
    totalMappingsCount: mappings.length
  };
}
