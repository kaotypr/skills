tags:: [[dashboard]], [[tasks]]

- # Active Tasks
  - ## NOW & LATER Tasks (Past 7 Days)
    - #+BEGIN_QUERY
      {:title "Active Tasks — Past 7 Days (by Priority)"
       :query [:find (pull ?b [*])
               :in $ ?start ?today
               :where
               [?b :block/marker ?marker]
               [(contains? #{"NOW" "LATER"} ?marker)]
               [?b :block/page ?p]
               [?p :block/journal? true]
               [?p :block/journal-day ?d]
               [(>= ?d ?start)]
               [(<= ?d ?today)]]
       :inputs [:7d-before :today]
       :result-transform (fn [result]
                           (sort-by (fn [h]
                                      (get h :block/priority "Z")) result))
       :group-by-page? false
       :collapsed? false}
      #+END_QUERY
  - ## Urgent Tasks
    - {{query (and (task NOW LATER) #urgent)}}
