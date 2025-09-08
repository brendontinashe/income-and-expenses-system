"use client"

import * as React from "react"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { Grid } from "@visx/grid"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale"
import { Bar, LinePath, Pie } from "@visx/shape"
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip"
import { localPoint } from "@visx/event"
import { LegendOrdinal } from "@visx/legend"
import { curveMonotoneX } from "@visx/curve"
import { Text } from "@visx/text"
import { cn } from "@/lib/utils"

// Define chart colors
const defaultColors = {
  blue: ["#0ea5e9", "#0284c7", "#0369a1"],
  green: ["#10b981", "#059669", "#047857"],
  red: ["#ef4444", "#dc2626", "#b91c1c"],
  yellow: ["#f59e0b", "#d97706", "#b45309"],
  purple: ["#8b5cf6", "#7c3aed", "#6d28d9"],
  pink: ["#ec4899", "#db2777", "#be185d"],
  indigo: ["#6366f1", "#4f46e5", "#4338ca"],
  emerald: ["#10b981", "#059669", "#047857"],
  rose: ["#f43f5e", "#e11d48", "#be123c"],
  orange: ["#f97316", "#ea580c", "#c2410c"],
}

// Helper to get color from theme
const getColor = (color: keyof typeof defaultColors | string, index = 0) => {
  if (color in defaultColors) {
    return defaultColors[color as keyof typeof defaultColors][index % 3]
  }
  return color
}

// Tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  color: "white",
  border: "1px solid white",
  borderRadius: "4px",
  fontSize: "14px",
}

// Common props for all charts
type CommonProps = {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  className?: string
}

// Bar Chart
type BarChartProps = CommonProps & {
  data: any[]
  index: string
  categories: string[]
  colors?: (keyof typeof defaultColors | string)[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["blue", "green"],
  valueFormatter = (value) => `${value}`,
  width = 500,
  height = 300,
  margin = { top: 20, right: 20, bottom: 50, left: 50 },
  yAxisWidth = 50,
  className,
}: BarChartProps) => {
  // Hooks for tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  // Dimensions
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand<string>({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data.flatMap((d) => categories.map((c) => (typeof d[c] === "number" ? d[c] : 0)))) * 1.1],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal<string, string>({
    domain: categories,
    range: colors.map((c) => getColor(c)),
  })

  // Handle tooltip
  const handleMouseOver = (event: React.MouseEvent, datum: any, category: string) => {
    const coords = localPoint(event.target as SVGElement, event)
    if (coords) {
      showTooltip({
        tooltipData: {
          label: datum[index],
          category,
          value: datum[category],
        },
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
      })
    }
  }

  return (
    <div className={cn("w-full h-full", className)} ref={containerRef}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="var(--border)"
            strokeOpacity={0.2}
            columnTickValues={xScale.domain()}
          />
          <AxisLeft
            scale={yScale}
            tickFormat={(value) => valueFormatter(Number(value))}
            stroke="var(--border)"
            tickStroke="var(--border)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 11,
              textAnchor: "end",
              dy: "0.33em",
            }}
            hideAxisLine
            tickLength={4}
            numTicks={5}
            left={0}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="var(--border)"
            tickStroke="var(--border)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 11,
              textAnchor: "middle",
              dy: "0.33em",
            }}
            hideAxisLine
            tickLength={4}
          />
          {categories.map((category, i) => (
            <React.Fragment key={`bars-${category}`}>
              {data.map((d, j) => {
                const barWidth = xScale.bandwidth() / categories.length
                const barX = (xScale(d[index]) || 0) + i * barWidth
                const barY = yScale(d[category] || 0)
                const barHeight = innerHeight - barY
                return (
                  <Bar
                    key={`bar-${category}-${j}`}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={colorScale(category)}
                    onMouseOver={(e) => handleMouseOver(e, d, category)}
                    onMouseOut={hideTooltip}
                  />
                )
              })}
            </React.Fragment>
          ))}
        </Group>
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
      </div>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>
            {tooltipData.category}: {valueFormatter(tooltipData.value)}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

// Line Chart
type LineChartProps = CommonProps & {
  data: any[]
  index: string
  categories: string[]
  colors?: (keyof typeof defaultColors | string)[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export const LineChart = ({
  data,
  index,
  categories,
  colors = ["blue"],
  valueFormatter = (value) => `${value}`,
  width = 500,
  height = 300,
  margin = { top: 20, right: 20, bottom: 50, left: 50 },
  yAxisWidth = 50,
  className,
}: LineChartProps) => {
  // Hooks for tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  // Dimensions
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const xScale = scaleBand<string>({
    domain: data.map((d) => d[index]),
    range: [0, innerWidth],
    padding: 0.3,
  })

  const yScale = scaleLinear<number>({
    domain: [
      Math.min(0, ...data.flatMap((d) => categories.map((c) => (typeof d[c] === "number" ? d[c] : 0)))) * 1.1,
      Math.max(...data.flatMap((d) => categories.map((c) => (typeof d[c] === "number" ? d[c] : 0)))) * 1.1,
    ],
    range: [innerHeight, 0],
    nice: true,
  })

  const colorScale = scaleOrdinal<string, string>({
    domain: categories,
    range: colors.map((c) => getColor(c)),
  })

  // Handle tooltip
  const handleMouseOver = (event: React.MouseEvent, datum: any, category: string) => {
    const coords = localPoint(event.target as SVGElement, event)
    if (coords) {
      showTooltip({
        tooltipData: {
          label: datum[index],
          category,
          value: datum[category],
        },
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
      })
    }
  }

  return (
    <div className={cn("w-full h-full", className)} ref={containerRef}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Group left={margin.left} top={margin.top}>
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="var(--border)"
            strokeOpacity={0.2}
            columnTickValues={xScale.domain()}
          />
          <AxisLeft
            scale={yScale}
            tickFormat={(value) => valueFormatter(Number(value))}
            stroke="var(--border)"
            tickStroke="var(--border)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 11,
              textAnchor: "end",
              dy: "0.33em",
            }}
            hideAxisLine
            tickLength={4}
            numTicks={5}
            left={0}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            stroke="var(--border)"
            tickStroke="var(--border)"
            tickLabelProps={{
              fill: "var(--foreground)",
              fontSize: 11,
              textAnchor: "middle",
              dy: "0.33em",
            }}
            hideAxisLine
            tickLength={4}
          />
          {categories.map((category) => (
            <LinePath
              key={`line-${category}`}
              data={data}
              x={(d) => (xScale(d[index]) || 0) + xScale.bandwidth() / 2}
              y={(d) => yScale(d[category] || 0)}
              stroke={colorScale(category)}
              strokeWidth={2}
              curve={curveMonotoneX}
            />
          ))}
          {categories.map((category) =>
            data.map((d, i) => (
              <circle
                key={`point-${category}-${i}`}
                cx={(xScale(d[index]) || 0) + xScale.bandwidth() / 2}
                cy={yScale(d[category] || 0)}
                r={4}
                fill={colorScale(category)}
                stroke="white"
                strokeWidth={2}
                onMouseOver={(e) => handleMouseOver(e, d, category)}
                onMouseOut={hideTooltip}
              />
            )),
          )}
        </Group>
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" shape="circle" />
      </div>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>
            {tooltipData.category}: {valueFormatter(tooltipData.value)}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}

// Pie Chart
type PieChartProps = CommonProps & {
  data: any[]
  index: string
  category: string
  colors?: (keyof typeof defaultColors | string)[]
  valueFormatter?: (value: number) => string
  innerRadius?: number
  outerRadius?: number
  cornerRadius?: number
  padAngle?: number
}

export const PieChart = ({
  data,
  index,
  category,
  colors = Object.keys(defaultColors) as (keyof typeof defaultColors)[],
  valueFormatter = (value) => `${value}`,
  width = 400,
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  innerRadius = 0,
  outerRadius,
  cornerRadius = 3,
  padAngle = 0.005,
  className,
}: PieChartProps) => {
  // Hooks for tooltip
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  // Dimensions
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const radius = Math.min(innerWidth, innerHeight) / 2
  const centerX = innerWidth / 2
  const centerY = innerHeight / 2

  // Scales
  const colorScale = scaleOrdinal<string, string>({
    domain: data.map((d) => d[index]),
    range: colors.map((c, i) => getColor(c, i % 3)),
  })

  // Handle tooltip
  const handleMouseOver = (event: React.MouseEvent, datum: any) => {
    const coords = localPoint(event.target as SVGElement, event)
    if (coords) {
      showTooltip({
        tooltipData: {
          label: datum.data[index],
          value: datum.data[category],
        },
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
      })
    }
  }

  // Calculate total for percentage
  const total = data.reduce((acc, curr) => acc + curr[category], 0)

  return (
    <div className={cn("w-full h-full", className)} ref={containerRef}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={data}
            pieValue={(d) => d[category]}
            outerRadius={outerRadius || radius}
            innerRadius={innerRadius}
            cornerRadius={cornerRadius}
            padAngle={padAngle}
          >
            {(pie) => {
              return pie.arcs.map((arc, i) => {
                const arcPath = pie.path(arc) || ""
                const arcData = arc.data
                const [centroidX, centroidY] = pie.path.centroid(arc)
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1

                return (
                  <g key={`arc-${i}`}>
                    <path
                      d={arcPath}
                      fill={colorScale(arcData[index])}
                      onMouseOver={(e) => handleMouseOver(e, arc)}
                      onMouseOut={hideTooltip}
                    />
                    {hasSpaceForLabel && (
                      <Text
                        x={centroidX}
                        y={centroidY}
                        textAnchor="middle"
                        verticalAnchor="middle"
                        style={{
                          fill: "white",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {((arcData[category] / total) * 100).toFixed(0)}%
                      </Text>
                    )}
                  </g>
                )
              })
            }}
          </Pie>
        </Group>
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
          flexWrap: "wrap",
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
          shape="circle"
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        />
      </div>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.label}</strong>
          </div>
          <div>
            {valueFormatter(tooltipData.value)} ({((tooltipData.value / total) * 100).toFixed(1)}%)
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
