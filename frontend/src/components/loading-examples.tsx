"use client";

import { useState } from "react";
import { Loading3DBus, MiniLoadingBus } from "./loading-3d-bus";
import { LoadingButton, AsyncLoadingButton } from "./loading-button";
import { LoadingCard, LoadingGrid, LoadingList, LoadingTable } from "./loading-card";
import { 
  Skeleton, 
  AvatarSkeleton, 
  TextSkeleton, 
  ButtonSkeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  ChartSkeleton,
  StatsSkeleton
} from "./loading-skeleton";
import { useLoading, usePageLoader, useInlineLoader } from "./loading-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoadingExamples() {
  const { showPageLoader, hidePageLoader, showInlineLoader, hideInlineLoader } = useLoading();
  const { withLoading } = usePageLoader();
  const { withInlineLoading } = useInlineLoader();
  const [buttonLoading, setButtonLoading] = useState(false);

  const simulateAsyncOperation = async () => {
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handlePageLoader = () => {
    showPageLoader("Loading page content...");
    setTimeout(hidePageLoader, 3000);
  };

  const handleInlineLoader = () => {
    showInlineLoader("Processing request...");
    setTimeout(hideInlineLoader, 3000);
  };

  const handleWithLoading = async () => {
    await withLoading(simulateAsyncOperation, "Loading with hook...");
  };

  const handleWithInlineLoading = async () => {
    await withInlineLoading(simulateAsyncOperation, "Processing with hook...");
  };

  const handleButtonClick = async () => {
    setButtonLoading(true);
    await simulateAsyncOperation();
    setButtonLoading(false);
  };

  const handleAsyncButtonClick = async () => {
    await simulateAsyncOperation();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">3D Bus Loading Examples</h1>
        <p className="text-muted-foreground">Comprehensive loading system for Where is My Bus</p>
      </div>

      {/* Main Loading Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Main Loading Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Small Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loading3DBus size="sm" text="Small" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medium Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loading3DBus size="md" text="Medium" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Large Loader</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loading3DBus size="lg" text="Large" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>With Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Loading3DBus size="md" text="Loading..." showProgress={true} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mini Loader */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Mini Loader</h2>
        <Card>
          <CardContent className="p-6">
            <MiniLoadingBus />
          </CardContent>
        </Card>
      </section>

      {/* Loading Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading Buttons</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <LoadingButton
            loading={buttonLoading}
            onClick={handleButtonClick}
            loadingText="Processing..."
          >
            Click to Load
          </LoadingButton>

          <AsyncLoadingButton
            onClick={handleAsyncButtonClick}
            loadingText="Async Loading..."
          >
            Async Button
          </AsyncLoadingButton>

          <LoadingButton
            loading={false}
            showLoader={false}
          >
            No Loader
          </LoadingButton>
        </div>
      </section>

      {/* Loading Provider Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading Provider Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={handlePageLoader}>Show Page Loader</Button>
          <Button onClick={handleInlineLoader}>Show Inline Loader</Button>
          <Button onClick={handleWithLoading}>With Loading Hook</Button>
          <Button onClick={handleWithInlineLoading}>With Inline Hook</Button>
        </div>
      </section>

      {/* Loading Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingCard title="Loading Card" lines={3} showAvatar={true} />
          <LoadingCard title="Another Card" lines={4} showAvatar={false} />
          <LoadingCard title="Last Card" lines={2} showAvatar={true} size="lg" />
        </div>
      </section>

      {/* Loading Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading Grid</h2>
        <LoadingGrid count={6} showAvatar={true} lines={3} />
      </section>

      {/* Loading List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading List</h2>
        <LoadingList count={5} showAvatar={true} />
      </section>

      {/* Loading Table */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading Table</h2>
        <LoadingTable rows={5} columns={4} />
      </section>

      {/* Skeleton Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Skeleton Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <TextSkeleton lines={4} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <AvatarSkeleton size="lg" />
                <div className="flex-1">
                  <TextSkeleton lines={2} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-x-2">
                <ButtonSkeleton />
                <ButtonSkeleton width="160px" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <CardSkeleton header={true} lines={3} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Advanced Skeletons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Advanced Skeletons</h2>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>List Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <ListSkeleton count={3} avatar={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={3} columns={3} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chart Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartSkeleton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <StatsSkeleton />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}