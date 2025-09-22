"use client";
import React from "react";
import { Skeleton, Card, Space, Row, Col } from "antd";

const InstagramSkeleton: React.FC<{ loading?: boolean; count?: number }> = ({
  loading = true,
  count = 3,
}) => {
  if (!loading) return null;

  return (
    <div className="flex items-start justify-center w-full gap-8">
      {/* Main Content (Feed) */}
      <div
        className="h-full mx-auto w-full"
        style={{ width: "calc(100% - 600px)" }}
      >
        <div className="w-full relative">
          <div className="max-w-[500px] absolute right-0 top-0 translate-x-[-30%]">
            {/* Stories Header */}
            <div className="mb-4 bg-white rounded-lg p-2 shadow-sm">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton.Avatar
                    key={index}
                    active
                    size={64}
                    shape="circle"
                    style={{ marginRight: 8 }}
                  />
                ))}
              </div>
            </div>

            {/* Feed Posts */}
            {Array.from({ length: count }).map((_, index) => (
              <Card
                key={index}
                className="mb-4 bg-white rounded-lg shadow-sm"
                styles={{
                  body: {
                    padding: 12,
                  },
                }}
              >
                {/* Post Header */}
                <div className="flex items-center mb-2">
                  <Skeleton.Avatar
                    active
                    size={40}
                    shape="circle"
                    style={{ marginRight: 12 }}
                  />
                  <Space direction="vertical" size={0}>
                    <Skeleton.Input active style={{ width: 120 }} />
                  </Space>
                </div>

                {/* Post Media */}
                <div className="mb-2">
                  <Skeleton.Image
                    active
                    style={{ width: "480px", height: "500px", borderRadius: 8 }}
                  />
                </div>

                {/* Post Actions */}
                <div className="flex justify-between mb-2">
                  <Space size={16}>
                    <Skeleton.Button active style={{ width: 40, height: 40 }} />
                    <Skeleton.Button active style={{ width: 40, height: 40 }} />
                    <Skeleton.Button active style={{ width: 40, height: 40 }} />
                  </Space>
                  <Skeleton.Button active style={{ width: 40, height: 40 }} />
                </div>

                {/* Caption */}
                <Skeleton paragraph={{ rows: 2 }} active title={false} />

                {/* Likes */}
                <Skeleton.Input active style={{ width: 100, marginTop: 8 }} />

                {/* Comments Preview */}
                <div className="mt-2">
                  <Space direction="vertical" size={8}>
                    <div className="flex items-start">
                      <Skeleton.Avatar
                        active
                        size={28}
                        shape="circle"
                        style={{ marginRight: 8 }}
                      />
                      <Skeleton.Input active style={{ width: 150 }} />
                    </div>
                    <div className="flex items-start">
                      <Skeleton.Avatar
                        active
                        size={28}
                        shape="circle"
                        style={{ marginRight: 8 }}
                      />
                      <Skeleton.Input active style={{ width: 180 }} />
                    </div>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar (Right Panel) */}
      <div className="h-full" style={{ width: "600px" }}>
        <div className="w-1/2 flex flex-col gap-4">
          {/* Current User Info */}
          <div className="mb-4 flex justify-between">
            <div className="flex items-center mb-2">
              <Skeleton.Avatar
                active
                size={40}
                shape="circle"
                style={{ marginRight: 12 }}
              />
              <Space direction="vertical" size={0}>
                <Skeleton.Input active style={{ width: 120 }} />
                <Skeleton.Button active style={{ width: 80 }} />
              </Space>
            </div>
            <Skeleton.Button active style={{ width: 60 }} />
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton.Avatar
                    active
                    size={40}
                    shape="circle"
                    style={{ marginRight: 12 }}
                  />
                  <Skeleton.Input active style={{ width: 100 }} />
                </div>
                <Skeleton.Button active style={{ width: 60 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramSkeleton;
