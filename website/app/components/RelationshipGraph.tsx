'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { GraphData, GraphNode, GraphLink } from '@/lib/graph-data';
import { useTheme } from '@/app/hooks/useTheme';
import styles from './RelationshipGraph.module.css';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

const LIGHT_CATEGORY_COLORS = {
  patterns: '#059669',
  'anti-patterns': '#ea580c',
  obstacles: '#dc2626',
};

const DARK_CATEGORY_COLORS = {
  patterns: '#0ca678',
  'anti-patterns': '#f76707',
  obstacles: '#e03131',
};

const RELATIONSHIP_COLORS = {
  solves: '#8b5cf6',
  similar: '#3b82f6',
  enables: '#06b6d4',
  uses: '#f59e0b',
  causes: '#dc2626',
  alternative: '#84cc16',
  related: '#6b7280',
  extends: '#ec4899',
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  solves: 'Solves',
  similar: 'Similar',
  enables: 'Enables',
  uses: 'Uses',
  causes: 'Causes',
  alternative: 'Alternative',
  related: 'Related',
  extends: 'Extends',
};

function getSlugFromFullSlug(fullSlug: string): string {
  const parts = fullSlug.split('/');
  return parts[parts.length - 1];
}

interface RelationshipGraphProps {
  graphData: GraphData;
}

interface ForceGraphNode extends GraphNode {
  x?: number;
  y?: number;
}

export default function RelationshipGraph({ graphData }: RelationshipGraphProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const categoryColors = theme === 'light' ? LIGHT_CATEGORY_COLORS : DARK_CATEGORY_COLORS;

  const handleNodeClick = useCallback((node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    const slug = getSlugFromFullSlug(typedNode.id);
    router.push(`/${typedNode.category}/${slug}/`);
  }, [router]);

  const getNodeSize = (node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    const baseSize = 8;
    const scaleFactor = 1.0;
    return baseSize + (typedNode.connections * scaleFactor);
  };

  const getNodeColor = (node: Record<string, unknown>) => {
    const typedNode = node as unknown as GraphNode;
    return categoryColors[typedNode.category];
  };

  const getLinkColor = (link: Record<string, unknown>) => {
    const typedLink = link as unknown as GraphLink;
    return RELATIONSHIP_COLORS[typedLink.type as keyof typeof RELATIONSHIP_COLORS] || '#999';
  };

  const getLinkDirectionalArrowLength = (link: Record<string, unknown>) => {
    const typedLink = link as unknown as GraphLink;
    // Symmetric relationships (no direction) should not have arrows
    const symmetricTypes = ['similar', 'alternative', 'related'];
    return symmetricTypes.includes(typedLink.type) ? 0 : 6;
  };

  if (graphData.nodes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No relationships found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.graphWrapper}>
        <ForceGraph2D
          graphData={graphData}
          nodeId="id"
          nodeLabel="name"
          nodeVal={getNodeSize}
          nodeColor={getNodeColor}
          nodeCanvasObject={(node: Record<string, unknown>, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const typedNode = node as unknown as ForceGraphNode;
            if (typeof typedNode.x === 'undefined' || typeof typedNode.y === 'undefined') return;

            const label = typedNode.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;

            const horizontalPadding = fontSize * 0.6;
            const verticalPadding = fontSize * 0.4;
            const rectWidth = textWidth + horizontalPadding * 2;
            const rectHeight = fontSize + verticalPadding * 2;
            const borderRadius = fontSize * 0.3;

            const nodeColor = getNodeColor(node);

            ctx.fillStyle = nodeColor;
            ctx.strokeStyle = nodeColor;
            ctx.lineWidth = 2 / globalScale;

            const x = typedNode.x - rectWidth / 2;
            const y = typedNode.y - rectHeight / 2;

            ctx.beginPath();
            ctx.moveTo(x + borderRadius, y);
            ctx.lineTo(x + rectWidth - borderRadius, y);
            ctx.arcTo(x + rectWidth, y, x + rectWidth, y + borderRadius, borderRadius);
            ctx.lineTo(x + rectWidth, y + rectHeight - borderRadius);
            ctx.arcTo(x + rectWidth, y + rectHeight, x + rectWidth - borderRadius, y + rectHeight, borderRadius);
            ctx.lineTo(x + borderRadius, y + rectHeight);
            ctx.arcTo(x, y + rectHeight, x, y + rectHeight - borderRadius, borderRadius);
            ctx.lineTo(x, y + borderRadius);
            ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, typedNode.x, typedNode.y);
          }}
          linkColor={getLinkColor}
          linkWidth={2}
          linkDirectionalArrowLength={getLinkDirectionalArrowLength}
          linkDirectionalArrowRelPos={0.95}
          onNodeClick={handleNodeClick}
          cooldownTime={3000}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.4}
        />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendSection}>
          <h4>Categories</h4>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: categoryColors.patterns }}></span>
              <span>Patterns</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: categoryColors['anti-patterns'] }}></span>
              <span>Anti-Patterns</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: categoryColors.obstacles }}></span>
              <span>Obstacles</span>
            </div>
          </div>
        </div>
        <div className={styles.legendSection}>
          <h4>Relationships</h4>
          <div className={styles.legendItems}>
            {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
              <div key={type} className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: color }}></span>
                <span>{RELATIONSHIP_LABELS[type] || type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
