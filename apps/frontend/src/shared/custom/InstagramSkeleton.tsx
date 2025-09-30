"use client";
import React from "react";
import { Skeleton, Card, Space } from "antd";

const InstagramSkeleton: React.FC<{ loading?: boolean; count?: number }> = ({
  loading = true,
  count = 3,
}) => {
  if (!loading) return null;

  return (
    <div className="flex items-start justify-center w-full gap-8">
      {/* Main Content (Feed) */}
      <div className="flex-1 w-full max-w-[700px]">
        <div className="flex flex-col gap-4">
          <div className="w-full py-2 max-w-[600px] mx-auto">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
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
          <div className="w-full flex flex-col items-center">
            <div className=" flex flex-col gap-4 w-full max-w-[500px]">
              {/* Stories Header */}

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
                      style={{
                        width: "480px",
                        height: "500px",
                        borderRadius: 8,
                      }}
                    />
                  </div>

                  {/* Post Actions */}
                  <div className="flex justify-between mb-2">
                    <Space size={16}>
                      <Skeleton.Button
                        active
                        style={{ width: 40, height: 40 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: 40, height: 40 }}
                      />
                      <Skeleton.Button
                        active
                        style={{ width: 40, height: 40 }}
                      />
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
      </div>

      {/* Sidebar (Right Panel) */}
      <div className="hidden lg:block w-[320px] flex-shrink-0">
        <div className="flex flex-col gap-6 sticky top-8 right-0">
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
