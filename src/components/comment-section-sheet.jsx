import { ThreadedCommentSection } from "@replyke/comments-threaded-react-js";
import { SocialCommentSection } from "@replyke/comments-social-react-js";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

function CommentSectionSheet({
  entity,
  open,
  onOpenChange,
  highlightedCommentId,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-white flex flex-col">
        <Tabs defaultValue="threaded" className="flex-1">
          <SheetHeader className="border-b border-gray-300">
            <VisuallyHidden>
              <SheetTitle>Comment section</SheetTitle>
              <SheetDescription>
                Users can leave comments on this sandbox
              </SheetDescription>
            </VisuallyHidden>
            <TabsList>
              <TabsTrigger value="threaded">Threaded style</TabsTrigger>
              <TabsTrigger value="social">Social style</TabsTrigger>
            </TabsList>
          </SheetHeader>
          <TabsContent value="threaded" className="p-2">
            <ThreadedCommentSection
              entity={entity}
              highlightedCommentId={highlightedCommentId}
              callbacks={
                {
                  // loginRequiredCallback: () => {
                  //   toast("Please log in first");
                  // },
                }
              }
            />
          </TabsContent>
          <TabsContent value="social">
            <SocialCommentSection
              entity={entity}
              highlightedCommentId={highlightedCommentId}
              callbacks={
                {
                  // loginRequiredCallback: () => {
                  //   toast("Please log in first");
                  // },
                }
              }
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default CommentSectionSheet;
