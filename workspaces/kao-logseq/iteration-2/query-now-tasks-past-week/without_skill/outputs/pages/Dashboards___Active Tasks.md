- ## Active Tasks from the Past 7 Days
- #+BEGIN_QUERY
  {:title [:h3 "NOW and LATER tasks from the past 7 days (sorted by priority)"]
   :query [:find (pull ?b [*])
           :in $ ?start
           :where
           [?b :block/marker ?marker]
           [(contains? #{"NOW" "LATER"} ?marker)]
           [?b :block/page ?p]
           [?p :block/journal? true]
           [?p :block/journal-day ?d]
           [(>= ?d ?start)]
           [?b :block/priority ?priority]]
   :inputs [:7d-before]
   :result-transform (fn [result]
                       (sort-by (fn [r]
                                  (case (get r :block/priority)
                                    "A" 0
                                    "B" 1
                                    "C" 2
                                    3))
                                result))
   :collapsed? false}
  #+END_QUERY
- ## Urgent Tasks
- {{query (and (task NOW LATER DOING TODO) [[urgent]])}}
