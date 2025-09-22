"use client";
import React, { useState } from "react";
import { Skeleton, Card, Space, Form, Radio, Switch } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
} from "@ant-design/icons";

type SizeType = "default" | "small" | "large";
type ButtonShapeType = "circle" | "square" | "round" | "default";
type AvatarShapeType = "circle" | "square";

interface BaseSkeletonProps {
  loading?: boolean;
  count?: number;
  size?: SizeType;
  buttonShape?: ButtonShapeType;
  avatarShape?: AvatarShapeType;
  active?: boolean;
  block?: boolean;
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  loading = true,
  count = 1,
  size = "default",
  buttonShape = "default",
  avatarShape = "circle",
  active = true,
  block = false,
}) => {
  if (!loading) return null;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          style={{
            marginBottom: 16,
            borderRadius: 8,
            width: block ? "100%" : "auto",
          }}
          bodyStyle={{ padding: 12 }}
        >
          {/* Header: Avatar + Username */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
          >
            <Skeleton.Avatar
              active={active}
              size={size === "small" ? 32 : size === "large" ? 48 : 40}
              shape={avatarShape}
              style={{ marginRight: 12 }}
            />
            <Space direction="vertical" size={0}>
              <Skeleton.Input
                active={active}
                size={size}
                style={{
                  width: size === "small" ? 80 : size === "large" ? 160 : 120,
                }}
              />
              <Skeleton.Input
                active={active}
                size={size}
                style={{
                  width: size === "small" ? 60 : size === "large" ? 100 : 80,
                }}
              />
            </Space>
          </div>

          {/* Media Placeholder: Ảnh/Video */}
          <div
            style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden" }}
          >
            <Skeleton.Image
              active={active}
              style={{
                width: "100%",
                height: size === "small" ? 200 : size === "large" ? 500 : 400,
                borderRadius: 8,
              }}
            />
          </div>

          {/* Actions: Like, Comment, Share, Save */}
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 12,
              paddingLeft: block ? 0 : 12,
            }}
          >
            <Space size={size === "small" ? 12 : size === "large" ? 24 : 16}>
              <Skeleton.Node
                active={active}
                style={{
                  width: size === "small" ? 32 : size === "large" ? 48 : 40,
                  height: size === "small" ? 32 : size === "large" ? 48 : 40,
                }}
              >
                <HeartOutlined
                  style={{
                    fontSize:
                      size === "small" ? 16 : size === "large" ? 24 : 20,
                    color: "#bfbfbf",
                  }}
                />
              </Skeleton.Node>
              <Skeleton.Node
                active={active}
                style={{
                  width: size === "small" ? 32 : size === "large" ? 48 : 40,
                  height: size === "small" ? 32 : size === "large" ? 48 : 40,
                }}
              >
                <MessageOutlined
                  style={{
                    fontSize:
                      size === "small" ? 16 : size === "large" ? 24 : 20,
                    color: "#bfbfbf",
                  }}
                />
              </Skeleton.Node>
              <Skeleton.Node
                active={active}
                style={{
                  width: size === "small" ? 32 : size === "large" ? 48 : 40,
                  height: size === "small" ? 32 : size === "large" ? 48 : 40,
                }}
              >
                <ShareAltOutlined
                  style={{
                    fontSize:
                      size === "small" ? 16 : size === "large" ? 24 : 20,
                    color: "#bfbfbf",
                  }}
                />
              </Skeleton.Node>
            </Space>
            <Skeleton.Node
              active={active}
              style={{
                width: size === "small" ? 32 : size === "large" ? 48 : 40,
                height: size === "small" ? 32 : size === "large" ? 48 : 40,
              }}
            >
              <BookOutlined
                style={{
                  fontSize: size === "small" ? 16 : size === "large" ? 24 : 20,
                  color: "#bfbfbf",
                }}
              />
            </Skeleton.Node>
          </Space>

          {/* Caption */}
          <Skeleton
            active={active}
            paragraph={{
              rows: size === "small" ? 1 : size === "large" ? 3 : 2,
            }}
            title={false}
            style={{ marginBottom: 8 }}
          />

          {/* Likes Count */}
          <Skeleton.Input
            active={active}
            size={size}
            style={{
              width: size === "small" ? 80 : size === "large" ? 120 : 100,
            }}
          />

          {/* Comments Preview */}
          <div style={{ marginTop: 12 }}>
            <Space
              direction="vertical"
              size={size === "small" ? 4 : size === "large" ? 12 : 8}
            >
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Skeleton.Avatar
                  active={active}
                  size={size === "small" ? 24 : size === "large" ? 36 : 28}
                  shape={avatarShape}
                  style={{ marginRight: 8 }}
                />
                <Skeleton.Input
                  active={active}
                  size={size}
                  style={{
                    width:
                      size === "small" ? 100 : size === "large" ? 200 : 150,
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Skeleton.Avatar
                  active={active}
                  size={size === "small" ? 24 : size === "large" ? 36 : 28}
                  shape={avatarShape}
                  style={{ marginRight: 8 }}
                />
                <Skeleton.Input
                  active={active}
                  size={size}
                  style={{
                    width:
                      size === "small" ? 120 : size === "large" ? 220 : 180,
                  }}
                />
              </div>
            </Space>
          </div>
        </Card>
      ))}
    </>
  );
};
export default BaseSkeleton;
